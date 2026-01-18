package org.devnqminh.studyfocus.dto;

public record SessionResponse(
        Long id,
        Double duration,
        Double breakTime,
        Integer count,
        Long userId,
        String username
) {
}
