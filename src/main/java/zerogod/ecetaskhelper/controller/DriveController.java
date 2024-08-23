package zerogod.ecetaskhelper.controller;

import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.google.api.client.http.FileContent;
import com.google.api.services.drive.model.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import zerogod.ecetaskhelper.model.FileItem;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class DriveController {

    @Autowired
    private Drive drive;

    @Value("${google.drive.forder.id}")
    private String folderId; // Google Drive 폴더 ID

    @PostMapping("/api/files/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is missing");
        }

        try {
            // 파일 메타데이터 설정
            File fileMetadata = new File();
            fileMetadata.setName(file.getOriginalFilename());
            fileMetadata.setParents(Collections.singletonList(folderId)); // 공유 폴더에 저장

            // 파일 콘텐츠 설정
            java.io.File filePath = new java.io.File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
            file.transferTo(filePath);
            FileContent fileContent = new FileContent(file.getContentType(), filePath);

            // Google Drive에 파일 업로드
            File uploadedFile = drive.files().create(fileMetadata, fileContent)
                    .setFields("id, name, parents, mimeType, webViewLink, webContentLink")
                    .execute();

            // 파일을 모든 사람이 볼 수 있도록 권한 설정
            Permission permission = new Permission();
            permission.setType("anyone");
            permission.setRole("reader");
            drive.permissions().create(uploadedFile.getId(), permission).execute();

            return ResponseEntity.ok("File uploaded successfully! File ID: " + uploadedFile.getId());

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping("/api/files/list")
    public ResponseEntity<List<FileItem>> listFiles() {
        try {
            List<FileItem> files = listFilesInFolder(folderId); // 지정된 폴더에서 파일 및 폴더 목록을 가져옴
            return ResponseEntity.ok(files);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    private List<FileItem> listFilesInFolder(String folderId) throws IOException {
        String query = "'" + folderId + "' in parents and trashed = false";
        FileList result = drive.files().list()
                .setQ(query)
                .setSpaces("drive")
                .setFields("files(id, name, mimeType, webViewLink, webContentLink, parents)")
                .execute();

        return result.getFiles().stream().map(file -> {
            boolean isFolder = "application/vnd.google-apps.folder".equals(file.getMimeType());
            String downloadLink = isFolder ? null : file.getWebContentLink();
            return new FileItem(file.getId(), file.getName(), isFolder, downloadLink);
        }).collect(Collectors.toList());
    }
}
