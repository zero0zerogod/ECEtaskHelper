package zerogod.ecetaskhelper.infra.oauth.naver.authcode;

import lombok.RequiredArgsConstructor;
import zerogod.ecetaskhelper.domain.OauthServerType;
import zerogod.ecetaskhelper.domain.authcode.AuthCodeRequestUrlProvider;
import zerogod.ecetaskhelper.infra.oauth.naver.NaverOauthConfig;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@RequiredArgsConstructor
public class NaverAuthCodeRequestUrlProvider implements AuthCodeRequestUrlProvider {

    private final NaverOauthConfig naverOauthConfig;

    @Override
    public OauthServerType supportServer() {
        return OauthServerType.NAVER;
    }

    @Override
    public String provide() {
        return UriComponentsBuilder
                .fromUriString("https://nid.naver.com/oauth2.0/authorize")
                .queryParam("response_type", "code")
                .queryParam("client_id", naverOauthConfig.clientId())
                .queryParam("redirect_uri", naverOauthConfig.redirectUri())
                .queryParam("state", "samplestate") // 이건 나중에 따로 찾아보고 설정해서 쓰세용!
                .build()
                .toUriString();
    }
}
