package zerogod.ecetaskhelper.controller;

import org.springframework.cache.annotation.Cacheable;
import zerogod.ecetaskhelper.service.SubjectService;
import zerogod.ecetaskhelper.model.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // 이 클래스가 RESTful 웹 서비스의 컨트롤러임을 나타냄
@RequestMapping("/api/subjects") // 이 컨트롤러의 기본 URL 경로 설정
public class SubjectController {

    private final SubjectService subjectService;

    // 생성자 주입을 통해 SubjectService 의존성을 주입받음
    @Autowired
    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    // 모든 과목(Subject) 정보를 조회하는 엔드포인트
    @GetMapping
    @Cacheable("subjects")
    public List<Subject> getAllSubjects() {
        return subjectService.findAll();
    }

    // 과목명을 기준으로 과목들을 검색하는 엔드포인트
    // 요청 파라미터로 전달된 name을 포함하는 과목들을 반환
    @GetMapping("/search")
    public List<Subject> searchSubjectsByName(@RequestParam String name) {
        return subjectService.findByNameContaining(name);
    }

    // 특정 과목 ID로 과목 정보를 조회하는 엔드포인트
    // 해당 과목이 없으면 404 Not Found 상태를 반환
    @GetMapping("/{subjectId}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable String subjectId) {
        Subject subject = subjectService.findById(subjectId);
        if (subject == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(subject);
    }
}
