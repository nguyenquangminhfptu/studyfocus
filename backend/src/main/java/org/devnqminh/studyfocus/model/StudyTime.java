package org.devnqminh.studyfocus.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "times")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class StudyTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // duration(float)
    @NotNull
    @Column(nullable = false)
    private Double duration;

    // break_time(float)
    @NotNull
    @Column(name = "break_time", nullable = false)
    private Double breakTime;

    // count(int) - số pomodoro / số phiên
    @NotNull
    @Column(nullable = false)
    private Integer count;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
