package zerogod.ecetaskhelper.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileItem {
    private String id;
    private String name;
    private boolean isFolder;
    private String downloadLink;
    private String modifiedTime;
    private String mimeType;
    private Long size;

    public FileItem(String id, String name, boolean isFolder, String downloadLink, String modifiedTime, String mimeType, Long size) {
        this.id = id;
        this.name = name;
        this.isFolder = isFolder;
        this.downloadLink = downloadLink;
        this.modifiedTime = modifiedTime;
        this.mimeType = mimeType;
        this.size = size;
    }
}


