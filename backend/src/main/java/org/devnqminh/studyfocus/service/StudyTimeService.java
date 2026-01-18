package org.devnqminh.studyfocus.service;

import org.devnqminh.studyfocus.dto.SessionRequest;
import org.devnqminh.studyfocus.dto.SessionResponse;

import java.util.List;

public interface StudyTimeService {

    SessionResponse saveSession(SessionRequest request, Long userId);

    List<SessionResponse> getUserSessions(Long userId);

    SessionResponse getSessionById(Long id, Long userId);

    void deleteSession(Long id, Long userId);

    //StatsResponse getUserStats(Long userId);
}
