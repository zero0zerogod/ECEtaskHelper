package zerogod.ecetaskhelper.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileItem {
    private final String id;
    private final String name;
    private final boolean isFolder;
    private final String downloadLink;

    public FileItem(String id, String name, boolean isFolder, String downloadLink) {
        this.id = id;
        this.name = name;
        this.isFolder = isFolder;
        this.downloadLink = downloadLink;
    }
}
