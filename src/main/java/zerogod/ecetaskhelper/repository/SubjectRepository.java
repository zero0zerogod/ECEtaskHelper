package zerogod.ecetaskhelper.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zerogod.ecetaskhelper.model.Subject;

import java.util.List;

@Repository // 이 인터페이스가 Spring의 저장소(Repository)로 사용됨을 나타냄
public interface SubjectRepository extends JpaRepository<Subject, String> {
    // 주어진 문자열을 포함하는 과목명을 가진 Subject들을 찾는 쿼리 메서드
    List<Subject> findBySubjectNameContaining(String name);
}
