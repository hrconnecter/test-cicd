package basic;

import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class CreateNewOrganization {

    private WebDriver driver;

    @BeforeClass
    public void setup() {
        // Initialize the browser
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(15));
        System.out.println("=========================================================");
        System.out.println("CREATE ORGANIZATION");
    }

    @Test
    public void createAndDeleteOrganization() throws InterruptedException {
        login();
        createOrganization();
        deleteOrganization();
        logout();
    }

    private void login() throws InterruptedException {
        driver.get("https://app.aegishrms.com/sign-in");

        // Enter credentials and login
        driver.findElement(By.name("email")).sendKeys("automationscripts@gmail.com");
        driver.findElement(By.name("password")).sendKeys("Pass@123");
        driver.findElement(By.xpath("//button[text()='Login']")).click();
        Thread.sleep(2000);

        System.out.println("Login successful");
    }

    private void createOrganization() throws InterruptedException {
        driver.findElement(By.linkText("Go To Organisation")).click();
        Thread.sleep(2000);

        driver.findElement(By.xpath("//a[text()='Add Organisation']")).click();

        // Fill out organization details
        driver.findElement(By.name("orgName")).sendKeys("Burberry 1");
        driver.findElement(By.name("foundation_date")).sendKeys("05/25/1967");
        selectIndustry("retail");
        driver.findElement(By.name("email")).sendKeys("burberry1@gmail.com");
        driver.findElement(By.name("contact_number")).sendKeys("9278525273");
        enterLocation("london");
        driver.findElement(By.xpath("//label[text()='Do you want 7 day Trial']")).click();

        Thread.sleep(2000);

        // Complete the process
        driver.findElement(By.xpath("(//button[@type='submit'])[1]")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("(//button[text()='Get Started'])[2]")).click();

        // Additional Details
        driver.findElement(By.name("count")).sendKeys("20");
        driver.findElement(By.name("cycleCount")).sendKeys(Keys.BACK_SPACE + "1");
        driver.findElement(By.xpath("(//input[@type='text'])[2]")).sendKeys("razorpay" + Keys.ENTER);
        driver.findElement(By.xpath("//button[text()='Confirm & Pay']")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//button[text()='Submit']")).click();

        System.out.println("Organization created successfully");
    }

    private void deleteOrganization() throws InterruptedException {
        Thread.sleep(5000);
        driver.findElement(By.xpath("//button[@aria-label='open drawer']")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//h1[text()='Home']")).click();
        driver.findElement(By.linkText("Dashboard")).click();
        Thread.sleep(3000);
        driver.findElement(By.xpath("//input[@placeholder='Search Organisation']")).sendKeys("Burberry 1" + Keys.ENTER);
        driver.findElement(By.xpath("(//*[local-name()='svg' and @data-testid='MoreVertIcon'])")).click();
        driver.findElement(By.xpath("//li[text()='Delete']")).click();
        driver.findElement(By.xpath("//button[text()='Delete']")).click();
        Thread.sleep(3000);

        System.out.println("Organization deleted successfully");
    }

    private void logout() throws InterruptedException {
        driver.findElement(By.id("basic-button")).click();
        driver.findElement(By.xpath("//div[text()=' Log out']")).click();
        Thread.sleep(2000);

        System.out.println("Logout successful");
    }

    private void selectIndustry(String industry) {
        WebElement industryInput = driver.findElement(By.id("react-select-3-input"));
        industryInput.click();
        industryInput.sendKeys(industry + Keys.ENTER);
    }

    private void enterLocation(String location) throws InterruptedException {
        WebElement locationInput = driver.findElement(By.xpath("(//input[@type='text'])[4]"));
        locationInput.sendKeys(location);
        Thread.sleep(2000);
        locationInput.sendKeys(Keys.ENTER);
    }

    @AfterClass
    public void teardown() throws InterruptedException {
        if (driver != null) {
        	Thread.sleep(3000);
        	System.out.println("=========================================================");
            driver.quit();
        }
    }
}
