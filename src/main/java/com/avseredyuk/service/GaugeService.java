package com.avseredyuk.service;

import com.avseredyuk.model.SensorReport;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.GraphicsEnvironment;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import javax.imageio.ImageIO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 12/31/17.
 */
@Service
public class GaugeService {
    private static final int tableSize = 150;
    private static final String T_WAT = "T WAT";
    private static final String T_AIR = "T AIR";
    private static final String HUM_ABS = "HUM ABS";
    private static final String HUM_REL = "HUM REL";
    private static final Color T_WAT_COLOR = new Color(128, 133, 233);
    private static final Color T_AIR_COLOR = new Color(144, 237, 125);
    private static final Color HUM_ABS_COLOR = new Color(228, 211, 84);
    private static final Color HUM_REL_COLOR = new Color(241, 92, 128);
    private final SensorReportService sensorReportService;
    
    @Autowired
    public GaugeService(SensorReportService sensorReportService) {
        this.sensorReportService = sensorReportService;
    }
    
    public byte[] getGauge() {
        SensorReport r = sensorReportService.getLastReport();
        BufferedImage image = new BufferedImage(tableSize, tableSize, BufferedImage.TYPE_INT_ARGB);
    
        Font valueFont = getFont(34f);
        Font nameFont = getFont(22f);
    
        Graphics valueGraphics = image.getGraphics();
        valueGraphics.setFont(valueFont);
        FontMetrics valueFontMetrics = valueGraphics.getFontMetrics();
    
        Graphics nameGraphics = image.getGraphics();
        nameGraphics.setFont(nameFont);
        
        drawStr(valueFontMetrics, valueGraphics, nameGraphics, T_WAT, formatValue(r.getWaterTemperature()), 30, T_WAT_COLOR);
        drawStr(valueFontMetrics, valueGraphics, nameGraphics, T_AIR, formatValue(r.getTemperature()), 70, T_AIR_COLOR);
        drawStr(valueFontMetrics, valueGraphics, nameGraphics, HUM_ABS, formatValue(calcAbsHumidity(r)), 110, HUM_ABS_COLOR);
        drawStr(valueFontMetrics, valueGraphics, nameGraphics, HUM_REL, formatValue(r.getHumidity()), 150, HUM_REL_COLOR);
    
        valueGraphics.dispose();
    
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);
            return  baos.toByteArray();
        } catch (IOException e) {
            System.out.println(e.toString() + "some i/o exception");
        }
        
        //todo: this is fucking disgusting
        return null;
    }
    
    private double calcAbsHumidity(SensorReport r) {
        double Dv = 0d;
        double m = 17.62d;
        double Tn = 243.12d;
        double Ta = 216.7d;
        double Rh = r.getHumidity();
        double Tc = r.getTemperature();
        double A = 6.112d;
        double K = 273.15d;
        Dv = (Ta * (Rh/100) * A * Math.exp(m*Tc/(Tn+Tc)) / (K + Tc));
        return Dv;
    }
    
    private String formatValue(Double d) {
        return String.format("%.1f", d);
    }
    
    private void drawStr(FontMetrics fm, Graphics g, Graphics ng, String name, String val, int y, Color color) {
        g.setColor(color);
        ng.setColor(color);
        Rectangle2D bounds = fm.getStringBounds(val, g);
        int x = tableSize - (int) bounds.getWidth();
        g.drawString(val, x, y);
        ng.drawString(name, 0, y);
    }
    
    private Font getFont(Float size) {
        Font font = null;
        try {
            
            URL dir_url = ClassLoader.getSystemResource("5069.ttf");
            File fontFile = new File(dir_url.toURI());
            
            font = Font.createFont(Font.TRUETYPE_FONT, fontFile).deriveFont(size);
            GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
            
            ge.registerFont(font);
            
        } catch (Exception ex) {
            System.out.println("Can't load font");
        }
        return font;
    }
}
