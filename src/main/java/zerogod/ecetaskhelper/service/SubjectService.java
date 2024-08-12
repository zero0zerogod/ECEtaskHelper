package zerogod.ecetaskhelper.service;

import zerogod.ecetaskhelper.model.Subject;
import zerogod.ecetaskhelper.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // 이 클래스가 서비스 레이어를 나타내며 비즈니스 로직을 처리함을 나타냄
public class SubjectService {
    private final SubjectRepository subjectRepository;

    // 생성자 주입을 통해 SubjectRepository 의존성을 주입받음
    @Autowired
    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    // 모든 Subject를 조회하는 메서드
    public List<Subject> findAll() {
        return subjectRepository.findAll();
    }

    // 특정 subjectId에 해당하는 Subject를 조회하는 메서드
    // 해당 ID의 Subject가 없으면 null을 반환
    public Subject findById(String subjectId) {
        return subjectRepository.findById(subjectId).orElse(null);
    }

    // 주어진 문자열을 포함하는 과목명을 가진 Subject들을 조회하는 메서드
    public List<Subject> findByNameContaining(String name) {
        return subjectRepository.findBySubjectNameContaining(name);
    }

    // Subject를 저장 또는 업데이트하는 메서드
    public Subject save(Subject subject) {
        return subjectRepository.save(subject);
    }
}
