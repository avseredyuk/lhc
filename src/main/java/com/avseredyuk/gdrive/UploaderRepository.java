package com.avseredyuk.gdrive;

import com.avseredyuk.configuration.AppConfiguration;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.googleapis.media.MediaHttpUploader;
import com.google.api.client.http.FileContent;
import com.google.api.client.http.HttpTransport;

import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.store.DataStoreFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.ParentReference;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Repository;

/**
 * Created by lenfer on 9/20/17.
 */
@Repository
public class UploaderRepository {
    private static final String APPLICATION_NAME = "Hydro-Collider/1.0";
    
    /** Directory to store user credentials. */
    private static final java.io.File DATA_STORE_DIR =
        new java.io.File(System.getProperty("user.home"), ".store/drive_sample");
    private static final String PARENT_FOLDER_ID = "0B7JuNXKn7s4SQzBBamc3cXJYZk0";
    
    /**
     * Global instance of the {@link DataStoreFactory}. The best practice is to make it a single
     * globally shared instance across your application.
     */
    private static FileDataStoreFactory dataStoreFactory;
    
    /** Global instance of the HTTP transport. */
    private static HttpTransport httpTransport;
    
    /** Global instance of the JSON factory. */
    private static final JacksonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    
    /** Global Drive API client. */
    private static Drive drive;
    
    /** Authorizes the installed application to access user's protected data. */
    private static Credential authorize() throws Exception {
        // load client secrets
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY,
            new InputStreamReader(AppConfiguration.class.getResourceAsStream("/client_secrets.json")));
        // set up authorization code flow
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
            httpTransport, JSON_FACTORY, clientSecrets,
            Collections.singleton(DriveScopes.DRIVE_FILE)).setDataStoreFactory(dataStoreFactory)
            .build();
        // authorize
        return new AuthorizationCodeInstalledApp(flow, new LocalServerReceiver()).authorize("user");
    }
    
    public List<Boolean> uploadBatch(List<java.io.File> files) {
        try {
            httpTransport = GoogleNetHttpTransport.newTrustedTransport();
            dataStoreFactory = new FileDataStoreFactory(DATA_STORE_DIR);
            // authorization
            Credential credential = authorize();
            // set up the global Drive instance
            drive = new Drive.Builder(httpTransport, JSON_FACTORY, credential).setApplicationName(
                APPLICATION_NAME).build();
            
            return files.stream()
                .map(this::uploadFile)
                .collect(Collectors.toList());
            
        } catch (IOException e) {
            System.err.println(e.getMessage());
            return null;
        } catch (Throwable t) {
            t.printStackTrace();
            return null;
        }
    }
    
    private boolean uploadFile(java.io.File file) {
        try {
            File fileMetadata = new File();
            fileMetadata.setTitle(file.getName());
            //todo: make GetIdByName
            fileMetadata.setParents(Arrays.asList(new ParentReference().setId(PARENT_FOLDER_ID)));
    
            FileContent mediaContent = new FileContent("application/json", file);
    
            Drive.Files.Insert insert = drive.files().insert(fileMetadata, mediaContent);
            MediaHttpUploader uploader = insert.getMediaHttpUploader();
            uploader.setDirectUploadEnabled(true);
            uploader.setProgressListener(new FileUploadProgressListener());
            insert.execute();
            return true;
        } catch (IOException e) {
            System.out.println(e);
        }
        return false;
    }
}
