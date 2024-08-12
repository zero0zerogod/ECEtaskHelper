package zerogod.ecetaskhelper.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import zerogod.ecetaskhelper.domain.OauthMember;
import zerogod.ecetaskhelper.model.Schedule;
import zerogod.ecetaskhelper.model.Subject;
import zerogod.ecetaskhelper.repository.ScheduleRepository;

import java.util.List;

@Service
@RequiredArgsConstructor // 필드에 대한 생성자를 자동으로 생성
public class ScheduleService {

    // ScheduleRepository를 주입받아 사용
    private final ScheduleRepository scheduleRepository;

    // Schedule 엔티티를 데이터베이스에 저장
    public void save(Schedule schedule) {
        scheduleRepository.save(schedule);
    }

    // 특정 Schedule ID와 OauthMember에 해당하는 Schedule을 삭제
    public boolean deleteByIdAndOauthMember(Long scheduleId, OauthMember member) {
        boolean exists = scheduleRepository.existsByIdAndOauthMember(scheduleId, member);
        if (exists) {
            scheduleRepository.deleteById(scheduleId);
            return true;
        } else {
            return false;
        }
    }

    // 특정 OauthMember에 해당하는 모든 Schedule 목록을 조회
    public List<Schedule> findByOauthMember(OauthMember oauthMember) {
        return scheduleRepository.findByOauthMember(oauthMember);
    }

    // 특정 OauthMember가 특정 Subject를 담고 있는지 여부를 확인
    public boolean existsByOauthMemberAndSubject(OauthMember oauthMember, Subject subject) {
        return scheduleRepository.existsByOauthMemberAndSubject(oauthMember, subject);
    }

    // ID를 통해 특정 Schedule을 조회
    public Schedule findById(Long id) {
        return scheduleRepository.findById(id).orElse(null);
    }
}
