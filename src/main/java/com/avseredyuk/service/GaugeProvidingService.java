package com.avseredyuk.service;

import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.model.Device;
import com.avseredyuk.model.SensorReport;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GraphicsEnvironment;
import java.awt.RenderingHints;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
public class GaugeProvidingService {
    private static final int IMG_SIZE = 150;
    private static final String T_WAT = "T WAT";
    private static final String T_AIR = "T AIR";
    private static final String HUM_ABS = "HUM ABS";
    private static final String HUM_REL = "HUM REL";
    private static final float VALUE_FONT_SIZE = 34f;
    private static final float NAME_FONT_SIZE = 22f;

    @Autowired
    private SensorReportService sensorReportService;
    @Autowired
    private DeviceService deviceService;
    @Autowired
    private DeviceReportDataExclusionService deviceReportDataExclusionService;
    @Value("classpath:5069.ttf")
    private Resource fontResource;
    @Value("classpath:gauge_placeholder.png")
    private Resource gaugePlaceholderResource;
    @Value("#{T(java.awt.Color).decode('${gauge.color.temperature.water}')}")
    private Color waterColor;
    @Value("#{T(java.awt.Color).decode('${gauge.color.temperature.air}')}")
    private Color airColor;
    @Value("#{T(java.awt.Color).decode('${gauge.color.humidity.absolute}')}")
    private Color humidityAbsoluteColor;
    @Value("#{T(java.awt.Color).decode('${gauge.color.humidity.relative}')}")
    private Color humidityRelativeColor;

    private List<Font> fonts;
    private byte[] gaugePlaceholderData;

    @PostConstruct
    private void postConstruct() throws IOException {
        fonts = initFonts();
        gaugePlaceholderData = Files.readAllBytes(Paths.get(gaugePlaceholderResource.getURI()));
    }

    @Cacheable("Gauge")
    public byte[] getGauge(Long deviceId) {
        if (fonts.isEmpty()) {
            return gaugePlaceholderData;
        }

        Device device = deviceService.findActiveById(deviceId)
                .orElseThrow(AccessDeniedException::new);

        SensorReport r = deviceReportDataExclusionService.filterByDeviceReportDataExclusion(device, sensorReportService.getLastReportByDevice(device));
        BufferedImage image = new BufferedImage(IMG_SIZE, IMG_SIZE, BufferedImage.TYPE_INT_ARGB);

        Font valueFont = fonts.get(0);
        Font nameFont = fonts.get(1);
    
        Graphics2D valueGraphics = (Graphics2D) image.getGraphics();
        valueGraphics.setFont(valueFont);
        FontMetrics valueFontMetrics = valueGraphics.getFontMetrics();
    
        Graphics2D nameGraphics = (Graphics2D) image.getGraphics();
        nameGraphics.setFont(nameFont);
    
        valueGraphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        nameGraphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        
        drawStr(valueFontMetrics, valueGraphics, nameGraphics, T_WAT, r == null ? "X" : formatValue(r.getWaterTemperature()), 30, waterColor);
        drawStr(valueFontMetrics, valueGraphics, nameGraphics, T_AIR, r == null ? "X" : formatValue(r.getTemperature()), 70, airColor);
        drawStr(valueFontMetrics, valueGraphics, nameGraphics, HUM_ABS, r == null ? "X" : formatValue(r.getAbsoluteHumidity()), 110, humidityAbsoluteColor);
        drawStr(valueFontMetrics, valueGraphics, nameGraphics, HUM_REL, r == null ? "X" : formatValue(r.getHumidity()), 150, humidityRelativeColor);
    
        valueGraphics.dispose();
    
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            ImageIO.write(image, "png", baos);
            return baos.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return gaugePlaceholderData;
    }
    
    private String formatValue(Double d) {
        return d == null ? "X" : String.format("%.1f", d);
    }
    
    private void drawStr(FontMetrics fm, Graphics g, Graphics ng, String name, String val, int y, Color color) {
        g.setColor(color);
        ng.setColor(color);
        Rectangle2D bounds = fm.getStringBounds(val, g);
        int x = IMG_SIZE - (int) bounds.getWidth();
        g.drawString(val, x, y);
        ng.drawString(name, 0, y);
    }
    
    private List<Font> initFonts() {
        try {
            Font createdFont = Font.createFont(Font.TRUETYPE_FONT, fontResource.getInputStream());
            return Stream.of(VALUE_FONT_SIZE, NAME_FONT_SIZE)
                    .map(createdFont::deriveFont)
                    .peek(font -> GraphicsEnvironment.getLocalGraphicsEnvironment().registerFont(font))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            e.printStackTrace();
        }
        return Collections.emptyList();
    }
}
