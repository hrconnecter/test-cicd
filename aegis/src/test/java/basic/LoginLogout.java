package basic;

import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class LoginLogout {

    private WebDriver driver;

    @BeforeClass
    public void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(15));
        driver.get("https://app.aegishrms.com/sign-in");
        System.out.println("=========================================================");
        System.out.println("LOGIN AND LOGOUT");
        //702220251aad4775bec54b6d34370a3f
        //702220251aad4775bec54b6d34370a3f
    }

    @Test
    public void adminLoginLogout() throws InterruptedException {
        login("automationscripts@gmail.com", "Pass@123");
        System.out.println("Admin Login done successfully");

        // Navigate to Organisation
        driver.findElement(By.xpath("//button[text()='Go To Organisation']")).click();
        driver.findElement(By.xpath("(//button[text()='Setup'])[2]")).click();

        logout();
        System.out.println("Admin Logout done successfully");
    }

    @Test(dependsOnMethods = "adminLoginLogout")
    public void employeeLoginLogout() throws InterruptedException {
        login("employee@burberry.com", "Pass@123");
        System.out.println("Employee Login done successfully");

        logout();
        System.out.println("Employee Logout done successfully");
    }

    private void login(String email, String password) throws InterruptedException {
        driver.findElement(By.name("email")).sendKeys(email);
        driver.findElement(By.name("password")).sendKeys(password);
        driver.findElement(By.xpath("//button[text()='Login']")).click();
    }

    private void logout() throws InterruptedException {
        Thread.sleep(3000);
        driver.findElement(By.id("basic-button")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//div[text()=' Log out']")).click();
    }

    @AfterClass
    public void teardown() throws InterruptedException {
        if (driver != null) {
            Thread.sleep(3000); // Ensure any lingering tasks are completed
            System.out.println("=========================================================");
            driver.quit();
        }
    }
}
