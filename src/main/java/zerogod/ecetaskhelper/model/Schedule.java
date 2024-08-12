package zerogod.ecetaskhelper.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import zerogod.ecetaskhelper.domain.OauthMember;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "schedule")
public class Schedule {

    public Schedule(OauthMember oauthMember, Subject subject, Boolean selected) {
        this.oauthMember = oauthMember;
        this.subject = subject;
        this.selected = selected;
    }

    // 엔티티의 기본 키를 나타내며, 값은 자동으로 생성됨
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // OauthMember 엔티티와의 다대일 관계 설정
    // "oauth_member_id"라는 외래 키로 매핑되며, "id" 컬럼을 참조
    // 지연 로딩(LAZY) 전략을 사용하여 필요할 때 데이터를 로드
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "oauth_member_id", referencedColumnName = "id", nullable = false)
    private OauthMember oauthMember;

    // Subject 엔티티와의 다대일 관계 설정
    // "subject_id"라는 외래 키로 매핑되며, "subject_id" 컬럼을 참조
    // 지연 로딩(LAZY) 전략을 사용
    // 직렬화 과정에서 hibernateLazyInitializer와 handler 속성을 무시하여 직렬화 에러 방지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", referencedColumnName = "subject_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Subject subject;

    @Column(name = "selected", nullable = false)
    private Boolean selected;

    public boolean isSelected() {
        return selected;
    }
}
