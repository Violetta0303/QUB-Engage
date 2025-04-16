package com;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = EngagementScoreApplication.class)
@AutoConfigureMockMvc
public class EngagementScoreControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testCalculateEngagementScore() throws Exception {
        mockMvc.perform(get("")
                .param("attendance_1", "30")
                .param("attendance_2", "20")
                .param("attendance_3", "40")
                .param("attendance_4", "50"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.error").value(false))
                .andExpect(jsonPath("$.message").isNumber());
    }

    @Test
    public void testMissingAttendance() throws Exception {
        mockMvc.perform(get("")
                .param("attendance_1", "30")
                .param("attendance_3", "40")
                .param("attendance_4", "50"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("All parameters are required.")));
    }
}