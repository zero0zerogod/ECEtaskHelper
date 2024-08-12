package zerogod.ecetaskhelper.domain.client;

import zerogod.ecetaskhelper.domain.OauthMember;
import zerogod.ecetaskhelper.domain.OauthServerType;

public interface OauthMemberClient {
    OauthServerType supportServer();

    OauthMember fetch(String code);
}