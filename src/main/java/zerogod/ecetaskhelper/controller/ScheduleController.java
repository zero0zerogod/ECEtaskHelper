package zerogod.ecetaskhelper.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import zerogod.ecetaskhelper.domain.OauthMember;
import zerogod.ecetaskhelper.domain.OauthMemberRepository;
import zerogod.ecetaskhelper.model.Schedule;
import zerogod.ecetaskhelper.model.Subject;
import zerogod.ecetaskhelper.service.ScheduleService;
import zerogod.ecetaskhelper.service.SubjectService;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedule") // 이 컨트롤러의 기본 URL 매핑 설정
public class ScheduleController {

    private final ScheduleService scheduleService; // Schedule 관련 서비스 로직을 담당하는 ScheduleService 주입
    private final SubjectService subjectService; // Subject 관련 서비스 로직을 담당하는 SubjectService 주입
    private final OauthMemberRepository oauthMemberRepository; // OauthMember 관련 데이터 접근을 담당하는 OauthMemberRepository 주입

    @PostMapping("/add") // 새로운 과목을 schedule에 추가하는 엔드포인트
    public ResponseEntity<String> addSubjectToSchedule(@RequestBody Map<String, String> requestData, HttpSession session) {
        // 클라이언트로부터 받은 요청 데이터에서 subjectId 추출
        String subjectId = requestData.get("subjectId");
        // 세션에서 로그인된 사용자 ID를 가져옴
        Long userId = (Long) session.getAttribute("userId");

        // 사용자가 로그인되어 있지 않은 경우 401 Unauthorized 상태 반환
        if (userId == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        // 로그인된 사용자 정보 가져오기
        OauthMember member = oauthMemberRepository.findById(userId).orElse(null);
        if (member == null) {
            return ResponseEntity.status(404).body("사용자 정보를 찾을 수 없습니다.");
        }

        // subjectId를 통해 과목 정보 가져오기
        Subject subject = subjectService.findById(subjectId);
        if (subject == null) {
            return ResponseEntity.status(404).body("과목 정보를 찾을 수 없습니다.");
        }

        // 이미 추가된 과목인지 확인
        boolean isSubjectAlreadyAdded = scheduleService.existsByOauthMemberAndSubject(member, subject);
        if (isSubjectAlreadyAdded) {
            return ResponseEntity.status(400).body("이미 담은 과목입니다.");
        }

        // 새로운 Schedule 객체 생성 후 저장
        Schedule schedule = new Schedule(member, subject, false);
        scheduleService.save(schedule);

        // 성공적으로 추가되었음을 클라이언트에게 알림
        return ResponseEntity.ok("과목이 schedule에 추가되었습니다.");
    }

    @PutMapping("/update-selected") // 시간표의 과목 선택 상태를 업데이트하는 엔드포인트
    public ResponseEntity<String> updateScheduleSelected(@RequestBody Map<String, Object> requestData, HttpSession session) {
        // 세션에서 로그인된 사용자 ID를 가져옴
        Long userId = (Long) session.getAttribute("userId");

        // 사용자가 로그인되어 있지 않은 경우 401 Unauthorized 상태 반환
        if (userId == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        // 디버깅을 위해 요청 데이터를 출력
        System.out.println("Request Data: " + requestData);

        // 요청 데이터에서 scheduleId와 selected 상태 추출
        String scheduleIdString = (String) requestData.get("scheduleId");
        Boolean selected = (Boolean) requestData.get("selected");

        // 필수 데이터가 없는 경우 400 Bad Request 상태 반환
        if (scheduleIdString == null || selected == null) {
            return ResponseEntity.status(400).body("잘못된 요청입니다.");
        }

        // scheduleId를 Long 타입으로 변환
        Long scheduleId = Long.parseLong(scheduleIdString);

        // 해당 schedule을 ID로 조회하고, 사용자와 일치하는지 확인
        Schedule schedule = scheduleService.findById(scheduleId);
        if (schedule == null || !schedule.getOauthMember().getId().equals(userId)) {
            return ResponseEntity.status(404).body("해당 schedule을 찾을 수 없습니다.");
        }

        // schedule의 선택 상태를 업데이트하고 저장
        schedule.setSelected(selected);
        scheduleService.save(schedule);

        return ResponseEntity.ok("schedule 상태가 업데이트되었습니다.");
    }

    @DeleteMapping("/delete/{scheduleId}") // 시간표에서 과목을 삭제하는 엔드포인트
    public ResponseEntity<String> deleteSubjectFromSchedule(@PathVariable Long scheduleId, HttpSession session) {
        // 세션에서 로그인된 사용자 ID를 가져옴
        Long userId = (Long) session.getAttribute("userId");

        // 사용자가 로그인되어 있지 않은 경우 401 Unauthorized 상태 반환
        if (userId == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        // 로그인된 사용자 정보 가져오기
        OauthMember member = oauthMemberRepository.findById(userId).orElse(null);
        if (member == null) {
            return ResponseEntity.status(404).body("사용자 정보를 찾을 수 없습니다.");
        }

        // 주어진 ID와 사용자 정보에 해당하는 과목 삭제
        boolean isDeleted = scheduleService.deleteByIdAndOauthMember(scheduleId, member);
        if (isDeleted) {
            return ResponseEntity.ok("과목이 shcedule에서 삭제되었습니다.");
        } else {
            return ResponseEntity.status(404).body("삭제할 과목을 찾을 수 없습니다.");
        }
    }

    @GetMapping("/user-schedule") // 사용자의 시간표를 조회하는 엔드포인트
    public ResponseEntity<List<Schedule>> getUserSchedule(HttpSession session) {
        // 세션에서 로그인된 사용자 ID를 가져옴
        Long userId = (Long) session.getAttribute("userId");

        // 사용자가 로그인되어 있지 않은 경우 401 Unauthorized 상태 반환
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        // 로그인된 사용자 정보 가져오기
        OauthMember member = oauthMemberRepository.findById(userId).orElse(null);
        if (member == null) {
            return ResponseEntity.status(404).body(null);
        }

        // 사용자의 시간표를 조회하고 반환
        List<Schedule> schedules = scheduleService.findByOauthMember(member);
        return ResponseEntity.ok(schedules);
    }
}
