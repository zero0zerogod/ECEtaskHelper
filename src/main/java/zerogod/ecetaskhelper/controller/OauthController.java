package zerogod.ecetaskhelper.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import zerogod.ecetaskhelper.domain.OauthMember;
import zerogod.ecetaskhelper.domain.OauthMemberRepository;
import zerogod.ecetaskhelper.service.OauthService;
import zerogod.ecetaskhelper.domain.OauthServerType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpSession;

@RequiredArgsConstructor
@RequestMapping("/oauth")
@RestController
public class OauthController {

    private final OauthService oauthService;
    private final OauthMemberRepository oauthMemberRepository; // 이 부분을 추가

    @SneakyThrows
    @GetMapping("/{oauthServerType}")
    ResponseEntity<Void> redirectAuthCodeRequestUrl(
            @PathVariable OauthServerType oauthServerType,
            HttpServletResponse response
    ) {
        String redirectUrl = oauthService.getAuthCodeRequestUrl(oauthServerType);
        response.sendRedirect(redirectUrl);
        return ResponseEntity.ok().build();
    }

    // 로그인 엔드포인트: 로그인 후 세션에 사용자 정보 저장
    @GetMapping("/login/{oauthServerType}")
    ResponseEntity<Long> login(
            @PathVariable OauthServerType oauthServerType,
            @RequestParam("code") String code,
            HttpSession session // 세션을 파라미터로 추가

    ) {
        Long userId = oauthService.login(oauthServerType, code);
        System.out.println("로그인 성공, 반환된 ID: " + userId); // 디버깅 로그

        // 세션에 사용자 ID 저장
        session.setAttribute("userId", userId);

        return ResponseEntity.ok(userId);
    }

    // 사용자 정보 조회 엔드포인트
    @GetMapping("/user-info")
    public ResponseEntity<OauthMember> getUserInfo(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(401).build(); // 세션에 사용자 정보가 없는 경우, 401 Unauthorized
        }

        OauthMember member = oauthMemberRepository.findById(userId).orElse(null);
        if (member != null) {
            System.out.println("사용자 정보 조회 성공, ID: " + userId);
            return ResponseEntity.ok(member);
        } else {
            System.out.println("사용자 정보 조회 실패, 존재하지 않는 ID: " + userId);
            return ResponseEntity.status(404).build(); // 해당 ID의 사용자가 없는 경우, 404 Not Found
        }
    }

    // 로그아웃 엔드포인트: 세션 무효화
    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();  // 세션 무효화
        return ResponseEntity.ok("로그아웃 성공");
    }
}