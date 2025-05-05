package essential;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class BaseDriverSetup{
	
	public static WebDriver getDriver() {
        ChromeOptions options = new ChromeOptions();

        // Detect if running in GitHub Actions
        if (System.getenv("GITHUB_ACTIONS") != null) {
        	options.addArguments("--window-size=1920,1080");
            options.addArguments("--headless=new");
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");
            options.addArguments("--disable-gpu");

            // Ensure unique user data dir (optional but recommended)
            String uniqueProfile = "/tmp/profile-" + System.currentTimeMillis();
            options.addArguments("--user-data-dir=" + uniqueProfile);
        }

        WebDriver driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(20));
        return driver;
	}
}
