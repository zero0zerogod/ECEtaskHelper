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
public class ScholarshipNoticeController extends NoticeScraper {
    private static final String URL = "https://www.ajou.ac.kr/kr/ajou/notice_scholarship.do";

    @Cacheable("scholarshipNotices")
    @GetMapping("/api/scholarship-notices")
    public List<Notice> getGeneralNotices() throws IOException {
        return scrapeNotices(URL);
    }
}
