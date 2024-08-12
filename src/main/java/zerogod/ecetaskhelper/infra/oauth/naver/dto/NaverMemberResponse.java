package zerogod.ecetaskhelper.infra.oauth.naver.dto;

import static zerogod.ecetaskhelper.domain.OauthServerType.NAVER;

import com.fasterxml.jackson.databind.PropertyNamingStrategies.SnakeCaseStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import zerogod.ecetaskhelper.domain.OauthId;
import zerogod.ecetaskhelper.domain.OauthMember;

@JsonNaming(value = SnakeCaseStrategy.class)
public record NaverMemberResponse(
        String resultcode,
        String message,
        Response response
) {

    public OauthMember toDomain() {
        return OauthMember.builder()
                .oauthId(new OauthId(String.valueOf(response.id), NAVER))
                .nickname(response.nickname)
                .profileImageUrl(response.profileImage)
                .build();
    }

    @JsonNaming(value = SnakeCaseStrategy.class)
    public record Response(
            String id,
            String nickname,
            String name,
            String email,
            String gender,
            String age,
            String birthday,
            String profileImage,
            String birthyear,
            String mobile
    ) {
    }
}
