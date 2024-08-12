package zerogod.ecetaskhelper.infra.oauth.google.dto;

import static zerogod.ecetaskhelper.domain.OauthServerType.GOOGLE;

import com.fasterxml.jackson.databind.PropertyNamingStrategies.SnakeCaseStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import zerogod.ecetaskhelper.domain.OauthId;
import zerogod.ecetaskhelper.domain.OauthMember;

@JsonNaming(SnakeCaseStrategy.class)
public record GoogleMemberResponse(
        String sub,
        String name,
        String picture,
        String email
) {

    public OauthMember toDomain() {
        return OauthMember.builder()
                .oauthId(new OauthId(sub, GOOGLE))
                .nickname(name)
                .profileImageUrl(picture)
                .build();
    }

    @JsonNaming(value = SnakeCaseStrategy.class)
    public record Email(
            String email,
            boolean emailVerified
    ) {
    }
}
