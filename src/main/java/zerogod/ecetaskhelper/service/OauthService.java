package zerogod.ecetaskhelper.service;

import lombok.RequiredArgsConstructor;
import zerogod.ecetaskhelper.domain.OauthMember;
import zerogod.ecetaskhelper.domain.OauthMemberRepository;
import zerogod.ecetaskhelper.domain.OauthServerType;
import zerogod.ecetaskhelper.domain.authcode.AuthCodeRequestUrlProviderComposite;
import zerogod.ecetaskhelper.domain.client.OauthMemberClientComposite;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OauthService {

    private final AuthCodeRequestUrlProviderComposite authCodeRequestUrlProviderComposite;
    private final OauthMemberClientComposite oauthMemberClientComposite;
    private final OauthMemberRepository oauthMemberRepository;

    public String getAuthCodeRequestUrl(OauthServerType oauthServerType) {
        return authCodeRequestUrlProviderComposite.provide(oauthServerType);
    }

    // 추가
    public Long login(OauthServerType oauthServerType, String authCode) {
        OauthMember oauthMember = oauthMemberClientComposite.fetch(oauthServerType, authCode);
        OauthMember saved = oauthMemberRepository.findByOauthId(oauthMember.oauthId())
                .orElseGet(() -> oauthMemberRepository.save(oauthMember));
        return saved.id();
    }
}

