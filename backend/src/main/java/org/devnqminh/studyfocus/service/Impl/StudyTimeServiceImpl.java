package org.devnqminh.studyfocus.service.Impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.devnqminh.studyfocus.dto.request.SessionRequest;
import org.devnqminh.studyfocus.dto.response.SessionResponse;
import org.devnqminh.studyfocus.dto.response.StatsResponse;
import org.devnqminh.studyfocus.dto.request.SessionRequest;
import org.devnqminh.studyfocus.dto.response.SessionResponse;
import org.devnqminh.studyfocus.model.StudyTime;
import org.devnqminh.studyfocus.model.User;
import org.devnqminh.studyfocus.repository.StudyTimeRepository;
import org.devnqminh.studyfocus.repository.UserRepository;
import org.devnqminh.studyfocus.service.IStudyTimeService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class StudyTimeServiceImpl  implements IStudyTimeService {
    private final StudyTimeRepository studyTimeRepository;
    private final UserRepository userRepository;


    /**
     * Lưu một study session
     */
    @Transactional
    @Override
    public SessionResponse saveSession(SessionRequest request, Long userId) {
        //find user
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        StudyTime studyTime = StudyTime.builder()
                .duration(request.duration())
                .breakTime(request.breakTime())
                .count(request.count())
                .user(user)
                .build();
        //save to db
        StudyTime savedStudyTime = studyTimeRepository.save(studyTime);
        return toSessionResponse(savedStudyTime);
    }

    /**
     * Lấy tất cả sessions của user
     */
    @Override

    public List<SessionResponse> getUserSessions(Long userId) {
        List<StudyTime> sessions = studyTimeRepository.findByUserIdOrderByIdDesc(userId);
        return sessions.stream()
                .map(this::toSessionResponse)
                .collect(Collectors.toList());
    }

    @Override

    public SessionResponse getSessionById(Long id, Long userId) {
        StudyTime session = studyTimeRepository.findById(id).orElseThrow(() -> new RuntimeException("Session not found"));
        //kiem tra ownership (session co thuoc ve user nay khong)

        if(!session.getUser().getId().equals(userId)) {
            throw new RuntimeException("Wrong user id");
        }
        return toSessionResponse(session);
    }

    /**
     * Xóa session
     */
    @Override
    public void deleteSession(Long id, Long userId) {
        StudyTime session = studyTimeRepository.findById(id).orElseThrow(() -> new RuntimeException("Session not found"));
        //check ownership
        if(!session.getUser().getId().equals(userId)) {
            throw new RuntimeException("Wrong user id");
        }
        studyTimeRepository.delete(session);
    }


    /**
     * Lấy statistics của user
     */
    @Override
    public StatsResponse getUserStats(Long userId) {
        Double totalTime = studyTimeRepository.getTotalStudyTimeByUserId(userId);
        Long totalSessions = studyTimeRepository.countByUserId(userId);
        Integer totalPomodoros = studyTimeRepository.getTotalPomodorosByUserId(userId);
        //tinh trung binh
        Double avgDuration = totalSessions > 0 ? (totalTime / totalSessions) : 0.0;
        return new StatsResponse(
                totalTime,
                totalSessions,
                avgDuration,
                totalPomodoros
        );
    }


    private SessionResponse toSessionResponse(StudyTime studyTime) {
        return new SessionResponse(
                studyTime.getId(),
                studyTime.getDuration(),
                studyTime.getBreakTime(),
                studyTime.getCount(),
                studyTime.getUser().getId(),
                studyTime.getUser().getName()
        );
    }
}
