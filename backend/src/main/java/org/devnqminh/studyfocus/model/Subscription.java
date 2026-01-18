package org.devnqminh.studyfocus.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import jakarta.persistence.Id;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;
    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;
    // 1 subscription plan can be used by many users (current plan)
    @OneToMany(mappedBy = "subscription")
    @Builder.Default
    private List<User> users = new ArrayList<>();
}
