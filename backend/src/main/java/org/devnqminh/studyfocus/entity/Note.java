package org.devnqminh.studyfocus.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Note {
    @Id
    private String id;
    private String noteDate;
    private String title;
    private String content;
    private Long createdAt;
}
