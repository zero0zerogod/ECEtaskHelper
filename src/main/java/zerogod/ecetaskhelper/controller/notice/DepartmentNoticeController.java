package zerogod.ecetaskhelper.controller.notice;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import zerogod.ecetaskhelper.model.Notice;
import zerogod.ecetaskhelper.model.NoticeScraper;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;

@RestController
public class DepartmentNoticeController extends NoticeScraper {
    private static final String URL = "https://ece.ajou.ac.kr/ece/bachelor/notice.do";

    @Cacheable("departmentNotices")
    @GetMapping("/api/department-notices")
    public List<Notice> getGeneralNotices() throws IOException {
        return scrapeNotices(URL);
    }
}
