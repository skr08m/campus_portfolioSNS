package com.example.campus_portfolio.service;

import com.example.campus_portfolio.entity.Work;
import com.example.campus_portfolio.repository.WorkRepository;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DriveService {

    private final Drive drive;
    private final WorkRepository workRepository;

    // 新規作品投稿
    public Work createWork(Work work) {
        work.setWorkUploadTime(ZonedDateTime.now());
        return workRepository.save(work);
    }

    // Drive 内のファイル一覧を取得するメソッド
    public List<File> listFiles() throws IOException {
        FileList result = drive.files().list()
                .setPageSize(10)
                .setFields("files(id, name, mimeType)")
                .execute();
        return result.getFiles();
    }
}