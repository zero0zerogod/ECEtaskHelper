package zerogod.ecetaskhelper.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zerogod.ecetaskhelper.model.Schedule;
import zerogod.ecetaskhelper.domain.OauthMember;
import zerogod.ecetaskhelper.model.Subject;

import java.util.List;

@Repository // 이 인터페이스가 Spring Data JPA repository임을 나타냄
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // 특정 OauthMember에 해당하는 모든 Schedule 목록을 조회
    List<Schedule> findByOauthMember(OauthMember oauthMember);

    // 특정 OauthMember가 이미 특정 Subject를 담고 있는지 여부를 확인
    boolean existsByOauthMemberAndSubject(OauthMember oauthMember, Subject subject);

    // 특정 Schedule ID가 주어진 OauthMember의 소유인지 여부를 확인
    boolean existsByIdAndOauthMember(Long id, OauthMember oauthMember);
}
