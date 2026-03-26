package org.devnqminh.studyfocus.model;

import java.time.Instant;

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
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
