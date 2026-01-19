package org.devnqminh.studyfocus.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.devnqminh.studyfocus.dto.request.SessionRequest;
import org.devnqminh.studyfocus.dto.response.SessionResponse;
import org.devnqminh.studyfocus.dto.response.StatsResponse;
import org.devnqminh.studyfocus.service.StudyTimeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-sessions")
@RequiredArgsConstructor
public class StudyTimeController {
    private final StudyTimeService studyTimeService;
    /**
     * Lưu một study session mới
     * POST /api/study-sessions
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SessionResponse saveSession(@Valid @RequestBody SessionRequest request) {
        //take json via RequestBody
        // TODO: Sau này lấy userId từ JWT, hiện tại hardcode = 1
        Long userId = 1L;
        return studyTimeService.saveSession(request, userId);

    }
    /**
     * Lấy tất cả sessions của user
     * GET /api/study-sessions
     */
    @GetMapping
    public List<SessionResponse> getUserSessions() {
        // TODO: Sau này lấy userId từ JWT
        Long userId = 1L;
        return studyTimeService.getUserSessions(userId);
    }
    /**
     * Lấy một session theo ID
     * GET /api/study-sessions/{id}
     */
    @GetMapping("/{id}")
    public SessionResponse getSession(@PathVariable("id") Long id) {
        Long userId = 1L;
        return studyTimeService.getSessionById(id, userId);
    }
    /**
     * Xóa một session
     * DELETE /api/study-sessions/{id}
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSession(@PathVariable Long id) {
        Long userId = 1L;
        studyTimeService.deleteSession(userId, id);
    }
    /**
     * Lấy statistics của user
     * GET /api/study-sessions/stats
     */
    @GetMapping("/stats/{id}")
    public StatsResponse getSessionStats(@PathVariable("id") Long id) {
        Long userId = 1L;
        return studyTimeService.getUserStats(id);
    }
}
