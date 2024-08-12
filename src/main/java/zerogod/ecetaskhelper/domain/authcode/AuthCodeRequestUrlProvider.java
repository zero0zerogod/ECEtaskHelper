package zerogod.ecetaskhelper.domain.authcode;
import zerogod.ecetaskhelper.domain.OauthServerType;

public interface AuthCodeRequestUrlProvider {

    OauthServerType supportServer();

    String provide();
}