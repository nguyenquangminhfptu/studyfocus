package org.devnqminh.studyfocus.repository;

import org.devnqminh.studyfocus.model.StudyTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;

public interface StudyTimeRepository extends JpaRepository<StudyTime, Long> {
    // Tìm sessions theo user, sắp xếp mới nhất trước
    List<StudyTime> findByUserIdOrderByIdDesc(Long userId);
    //Tính tổng time tự học
    @Query("SELECT COALESCE(SUM(st.duration), 0.0) FROM StudyTime st WHERE st.user.id = :userId")
    Double getTotalStudyTimeByUserId(@Param("userId") Long userId);
    //Đến số session
    Long countByUserId(Long userId);
    // Tính tổng số pomodoros
    @Query("SELECT COALESCE(SUM(st.count), 0) FROM StudyTime st WHERE st.user.id = :userId")
    Integer getTotalPomodorosByUserId(@Param("userId") Long userId);

}
