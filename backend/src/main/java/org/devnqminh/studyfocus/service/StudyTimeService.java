package org.devnqminh.studyfocus.service;

import lombok.RequiredArgsConstructor;
import org.devnqminh.studyfocus.dto.request.SessionRequest;
import org.devnqminh.studyfocus.dto.response.SessionResponse;
import org.devnqminh.studyfocus.dto.response.StatsResponse;
import org.springframework.stereotype.Service;

import java.util.List;

public interface StudyTimeService {

    SessionResponse saveSession(SessionRequest request, Long userId);

    List<SessionResponse> getUserSessions(Long userId);

    SessionResponse getSessionById(Long id, Long userId);

    void deleteSession(Long id, Long userId);

    StatsResponse getUserStats(Long userId);
}
