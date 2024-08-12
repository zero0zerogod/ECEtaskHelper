package zerogod.ecetaskhelper.infra.oauth.naver;

import lombok.RequiredArgsConstructor;
import zerogod.ecetaskhelper.domain.OauthMember;
import zerogod.ecetaskhelper.domain.OauthServerType;
import zerogod.ecetaskhelper.domain.client.OauthMemberClient;
import zerogod.ecetaskhelper.infra.oauth.naver.client.NaverApiClient;
import zerogod.ecetaskhelper.infra.oauth.naver.dto.NaverMemberResponse;
import zerogod.ecetaskhelper.infra.oauth.naver.dto.NaverToken;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Component
@RequiredArgsConstructor
public class NaverMemberClient implements OauthMemberClient {

    private final NaverApiClient naverApiClient;
    private final NaverOauthConfig naverOauthConfig;

    @Override
    public OauthServerType supportServer() {
        return OauthServerType.NAVER;
    }

    @Override
    public OauthMember fetch(String authCode) {
        NaverToken tokenInfo = naverApiClient.fetchToken(tokenRequestParams(authCode));
        NaverMemberResponse naverMemberResponse = naverApiClient.fetchMember("Bearer " + tokenInfo.accessToken());
        return naverMemberResponse.toDomain();
    }

    private MultiValueMap<String, String> tokenRequestParams(String authCode) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", naverOauthConfig.clientId());
        params.add("client_secret", naverOauthConfig.clientSecret());
        params.add("code", authCode);
        params.add("state", naverOauthConfig.state());
        return params;
    }
}