package org.devnqminh.studyfocus.dto.response;

public record StatsResonpse(
         Double totalStudyTime,
         Long totalSessions,
         Double averageSessionDuration,
         Integer totalPomodoros
) {
}
