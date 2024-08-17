package zerogod.ecetaskhelper.model;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

public class NoticeScraper {
    public List<Notice> scrapeNotices(String url, Comparator<Notice> comparator) throws IOException {
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
                String link = url + "?mode=view&articleNo=" + articleNo;

                // Notice 객체 생성 후 리스트에 추가
                notices.add(new Notice(category, title, department, date, link));
            }
        }

        Stream<Notice> noticeStream = notices.stream();

        if (comparator != null)
            noticeStream = noticeStream.sorted(comparator);

        // 공지사항의 수가 5개를 초과할 경우, 상위 5개만 선택
        if (notices.size() > 5) {
            return noticeStream
                    .limit(5)
                    .toList();
        }
        else
            return noticeStream.toList();
    }
}