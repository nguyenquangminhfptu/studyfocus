package org.devnqminh.studyfocus.dto;

public record StatsResonpse(
         Double totalStudyTime,
         Long totalSessions,
         Double averageSessionDuration,
         Integer totalPomodoros
) {
}
