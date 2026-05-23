package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProfileDTO;
import com.ecommerce.backend.model.Profile;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileDTO getProfile(User user) {
        Profile profile = profileRepository.findByUser(user)
                .orElse(new Profile());

        ProfileDTO dto = new ProfileDTO();
        dto.setId(profile.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(profile.getPhone());
        dto.setAddress(profile.getAddress());
        dto.setCity(profile.getCity());
        dto.setState(profile.getState());
        dto.setZipCode(profile.getZipCode());
        dto.setCountry(profile.getCountry());

        return dto;
    }

    public ProfileDTO updateProfile(User user, ProfileDTO dto) {
        Profile profile = profileRepository.findByUser(user)
                .orElse(new Profile());

        profile.setUser(user);
        profile.setPhone(dto.getPhone());
        profile.setAddress(dto.getAddress());
        profile.setCity(dto.getCity());
        profile.setState(dto.getState());
        profile.setZipCode(dto.getZipCode());
        profile.setCountry(dto.getCountry());

        profileRepository.save(profile);
        return getProfile(user);
    }
}