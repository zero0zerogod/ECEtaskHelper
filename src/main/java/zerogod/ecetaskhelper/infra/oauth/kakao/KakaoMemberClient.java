package zerogod.ecetaskhelper.infra.oauth.kakao;

import lombok.RequiredArgsConstructor;
import zerogod.ecetaskhelper.domain.OauthMember;
import zerogod.ecetaskhelper.domain.OauthServerType;
import zerogod.ecetaskhelper.domain.client.OauthMemberClient;
import zerogod.ecetaskhelper.infra.oauth.kakao.client.KakaoApiClient;
import zerogod.ecetaskhelper.infra.oauth.kakao.dto.KakaoMemberResponse;
import zerogod.ecetaskhelper.infra.oauth.kakao.dto.KakaoToken;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Component
@RequiredArgsConstructor
public class KakaoMemberClient implements OauthMemberClient {

    private final KakaoApiClient kakaoApiClient;
    private final KakaoOauthConfig kakaoOauthConfig;

    @Override
    public OauthServerType supportServer() {
        return OauthServerType.KAKAO;
    }

    @Override
    public OauthMember fetch(String authCode) {
        KakaoToken tokenInfo = kakaoApiClient.fetchToken(tokenRequestParams(authCode)); // (1)
        KakaoMemberResponse kakaoMemberResponse =
                kakaoApiClient.fetchMember("Bearer " + tokenInfo.accessToken());  // (2)
        return kakaoMemberResponse.toDomain();  // (3)
    }

    private MultiValueMap<String, String> tokenRequestParams(String authCode) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoOauthConfig.clientId());
        params.add("redirect_uri", kakaoOauthConfig.redirectUri());
        params.add("code", authCode);
        params.add("client_secret", kakaoOauthConfig.clientSecret());
        return params;
    }
}
