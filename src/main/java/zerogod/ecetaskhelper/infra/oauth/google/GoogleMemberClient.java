package zerogod.ecetaskhelper.infra.oauth.google;

import lombok.RequiredArgsConstructor;
import zerogod.ecetaskhelper.domain.OauthMember;
import zerogod.ecetaskhelper.domain.OauthServerType;
import zerogod.ecetaskhelper.domain.client.OauthMemberClient;
import zerogod.ecetaskhelper.infra.oauth.google.client.GoogleApiClient;
import zerogod.ecetaskhelper.infra.oauth.google.dto.GoogleMemberResponse;
import zerogod.ecetaskhelper.infra.oauth.google.dto.GoogleToken;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Component
@RequiredArgsConstructor
public class GoogleMemberClient implements OauthMemberClient {

    private final GoogleApiClient googleApiClient;
    private final GoogleOauthConfig googleOauthConfig;

    @Override
    public OauthServerType supportServer() {
        return OauthServerType.GOOGLE;
    }

    @Override
    public OauthMember fetch(String authCode) {
        GoogleToken tokenInfo = googleApiClient.fetchToken(tokenRequestParams(authCode));
        GoogleMemberResponse googleMemberResponse = googleApiClient.fetchMember("Bearer " + tokenInfo.accessToken());
        return googleMemberResponse.toDomain();
    }

    private MultiValueMap<String, String> tokenRequestParams(String authCode) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", googleOauthConfig.clientId());
        params.add("client_secret", googleOauthConfig.clientSecret());
        params.add("redirect_uri", googleOauthConfig.redirectUri());
        params.add("code", authCode);
        return params;
    }
}