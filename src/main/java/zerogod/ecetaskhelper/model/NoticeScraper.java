package zerogod.ecetaskhelper.model;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class NoticeScraper {
    public List<Notice> scrapeNotices(String url) throws IOException {
        // Jsoup으로 URL에서 HTML 문서를 가져옴
        Document doc = Jsoup.connect(url).get();

        List<Notice> notices = new ArrayList<>();

        // 고정된 공지사항 처리
        Elements fixedRows = doc.select("tr.b-top-box");
        addNotices(notices, fixedRows, url, true);

        // 일반 공지사항 처리
        Elements generalRows = doc.select("tr:not(.b-top-box)");
        addNotices(notices, generalRows, url, false);

        return notices;
    }

    private void addNotices(List<Notice> notices, Elements rows, String url, boolean isFixed) {
        int limit = isFixed ? rows.size() : 6;

        for (int i = 0; i < limit; i++) {
            Element row = rows.get(i);
            String number = isFixed ? "공지" : getElementText(row, 0); // 고정된 공지사항의 번호는 "공지"로 설정
            String category = getElementText(row, 1); // 분류 텍스트 추출
            Element titleElement = row.selectFirst("td a"); // 제목과 링크가 포함된 요소 선택
            String department = getElementText(row, 4); // 공지부서 텍스트 추출
            String date = getElementText(row, 5); // 작성일자 텍스트 추출

            if (titleElement != null) {
                String title = titleElement.text(); // 제목 텍스트 추출
                String articleNo = titleElement.attr("href").split("articleNo=")[1].split("&")[0];
                String link = url + "?mode=view&articleNo=" + articleNo;

                // Notice 객체 생성 후 리스트에 추가
                notices.add(new Notice(number, category, title, department, date, link));
            }
        }
    }

    private String getElementText(Element row, int index) {
        Elements elements = row.select("td");
        return elements.size() > index ? elements.get(index).text() : "";
    }
}
