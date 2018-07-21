package com.avseredyuk.service;

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
import javax.imageio.ImageIO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 12/31/17.
 */
@Service
public class GaugeProvidingService {
    private static final int IMG_SIZE = 150;
    private static final String T_WAT = "T WAT";
    private static final String T_AIR = "T AIR";
    private static final String HUM_ABS = "HUM ABS";
    private static final String HUM_REL = "HUM REL";
    private static final float VALUE_FONT_SIZE = 34f;
    private static final float NAME_FONT_SIZE = 22f;
    private final SensorReportService sensorReportService;
    private final DeviceService deviceService;
    private Font loadedFont;
    private Resource res;
    private Color waterColor;
    private Color airColor;
    private Color humidityAbsoluteColor;
    private Color humidityRelativeColor;
    
    //todo: colours from config ???
    @Autowired
    public GaugeProvidingService(SensorReportService sensorReportService, DeviceService deviceService,
                                 @Value("classpath:5069.ttf") Resource res,
                                 @Value("${gauge.color.temperature.water}") String waterColor,
                                 @Value("${gauge.color.temperature.air}") String airColor,
                                 @Value("${gauge.color.humidity.absolute}") String humidityAbsoluteColor,
                                 @Value("${gauge.color.humidity.relative}") String humidityRelativeColor) {
        this.sensorReportService = sensorReportService;
        this.deviceService = deviceService;
        this.res = res;
        this.waterColor = Color.decode(waterColor);
        this.airColor = Color.decode(airColor);
        this.humidityAbsoluteColor = Color.decode(humidityAbsoluteColor);
        this.humidityRelativeColor = Color.decode(humidityRelativeColor);
    }
    
    @Cacheable("Gauge")
    public byte[] getGauge(Long deviceId) {
        Device device = deviceService.findById(deviceId);
        SensorReport r = sensorReportService.getLastReportByDevice(device);
        BufferedImage image = new BufferedImage(IMG_SIZE, IMG_SIZE, BufferedImage.TYPE_INT_ARGB);
    
        Font valueFont = getFont(VALUE_FONT_SIZE);
        Font nameFont = getFont(NAME_FONT_SIZE);
    
        Graphics2D valueGraphics = (Graphics2D) image.getGraphics();
        valueGraphics.setFont(valueFont);
        FontMetrics valueFontMetrics = valueGraphics.getFontMetrics();
    
        Graphics2D nameGraphics = (Graphics2D) image.getGraphics();
        nameGraphics.setFont(nameFont);
    
        valueGraphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        nameGraphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        
        drawStr(valueFontMetrics, valueGraphics, nameGraphics, T_WAT, formatValue(r.getWaterTemperature()), 30, waterColor);
        drawStr(valueFontMetrics, valueGraphics, nameGraphics, T_AIR, formatValue(r.getTemperature()), 70, airColor);
        drawStr(valueFontMetrics, valueGraphics, nameGraphics, HUM_ABS, formatValue(calcAbsHumidity(r)), 110, humidityAbsoluteColor);
        drawStr(valueFontMetrics, valueGraphics, nameGraphics, HUM_REL, formatValue(r.getHumidity()), 150, humidityRelativeColor);
    
        valueGraphics.dispose();
    
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);
            return baos.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        //todo: this is fucking disgusting
        return null;
    }
    
    private double calcAbsHumidity(SensorReport r) {
        double hum = r.getHumidity();
        double temp = r.getTemperature();
        return 216.7d * (hum / 100) * 6.112d * Math.exp(17.62d * temp / (243.12d + temp)) / (273.15d + temp);
    }
    
    private String formatValue(Double d) {
        return String.format("%.1f", d);
    }
    
    private void drawStr(FontMetrics fm, Graphics g, Graphics ng, String name, String val, int y, Color color) {
        g.setColor(color);
        ng.setColor(color);
        Rectangle2D bounds = fm.getStringBounds(val, g);
        int x = IMG_SIZE - (int) bounds.getWidth();
        g.drawString(val, x, y);
        ng.drawString(name, 0, y);
    }
    
    private Font getFont(Float size) {
        Font font = null;
        try {
            if (loadedFont == null) {
                loadedFont = Font.createFont(Font.TRUETYPE_FONT, res.getInputStream());
            }
            font = loadedFont.deriveFont(size);
            GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
            ge.registerFont(font);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return font;
    }
}
