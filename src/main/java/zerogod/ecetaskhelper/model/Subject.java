package zerogod.ecetaskhelper.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "subjects")
public class Subject {
    public Subject(String subjectId, String subjectName, String professor, String time, String location) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.professor = professor;
        this.time = time;
        this.location = location;
    }

    @Id
    @Column(name = "subject_id", nullable = false)
    private String subjectId;

    @Setter
    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @Setter
    @Column(name = "professor", nullable = false)
    private String professor;

    @Setter
    @Column(name = "time", nullable = false)
    private String time;

    @Setter
    @Column(name = "location", nullable = false)
    private String location;

}
