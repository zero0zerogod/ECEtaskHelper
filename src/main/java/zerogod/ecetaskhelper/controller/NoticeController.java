package zerogod.ecetaskhelper.controller;

import zerogod.ecetaskhelper.model.Notice;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
public class NoticeController {

    @GetMapping("/api/notices")
    public List<Notice> getNotices() throws IOException {
        // 스크래핑할 URL
        String url = "https://www.ajou.ac.kr/kr/ajou/notice.do";
        // Jsoup으로 URL에서 HTML 문서를 가져옴
        Document doc = Jsoup.connect(url).get();

        List<Notice> notices = new ArrayList<>();

        // 고정된 공지사항을 선택 (class="b-top-box"가 있는 tr 요소만)
        Elements rows = doc.select("tr.b-top-box");

        for (Element row : rows) {
            String category = row.select("td").get(1).text(); // 분류 텍스트 추출
            Element titleElement = row.selectFirst("td a"); // 제목과 링크가 포함된 요소 선택
            String department = row.select("td").get(4).text(); // 공지부서 텍스트 추출
            String date = row.select("td").get(5).text(); // 작성일자 텍스트 추출

            if (titleElement != null) {
                String title = titleElement.text(); // 제목 텍스트 추출
                String articleNo = titleElement.attr("href").split("articleNo=")[1].split("&")[0];
                String link = "https://www.ajou.ac.kr/kr/ajou/notice.do?mode=view&articleNo=" + articleNo;

                // Notice 객체 생성 후 리스트에 추가
                notices.add(new Notice(category, title, department, date, link));
            }
        }

        // 작성일 기준으로 최신 5개의 공지사항만 반환
        return notices.stream()
                .sorted(Comparator.comparing(Notice::date).reversed()) // 최신 작성일 기준으로 정렬
                .limit(5) // 상위 5개만 선택
                .toList();
    }
}