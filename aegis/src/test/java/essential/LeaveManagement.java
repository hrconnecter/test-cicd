package essential;

import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class LeaveManagement {

    private WebDriver driver;

    @BeforeClass
    public void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(15));
        driver.get("https://app.aegishrms.com");
        System.out.println("=========================================================");
        System.out.println("LEAVE MANAGEMENT");
    }

    @Test
    public void leaveManagement() throws InterruptedException {
        login("employee@raulflauren.com", "Pass@123");
        System.out.println("Login successful");

        navigateToAttendanceCalendar();

        applyLeave("Casual leave");
        System.out.println("Leave Request raised successfully");

        deleteLeaveRequest("Invalid");
        System.out.println("Leave request deleted successfully");

        logout();
        System.out.println("Logout successful");
    }

    private void login(String email, String password) throws InterruptedException {
        driver.findElement(By.name("email")).sendKeys(email);
        driver.findElement(By.name("password")).sendKeys(password);
        Thread.sleep(2000); // Simulating delay
        driver.findElement(By.xpath("//button[text()='Login']")).click();
    }

    private void logout() throws InterruptedException {
        Thread.sleep(3000);
        driver.findElement(By.id("basic-button")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//div[text()=' Log out']")).click();
    }

    private void navigateToAttendanceCalendar() throws InterruptedException {
        driver.findElement(By.xpath("//button[@aria-label='open drawer']")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//h1[text()='Attendance']")).click();
        driver.findElement(By.xpath("//h1[text()='Manage Leaves']")).click();
        Thread.sleep(2000);
    }

    private void applyLeave(String leaveType) throws InterruptedException {
        driver.findElement(By.xpath("//h1[text()='07']/..")).click(); // Select a date
        Thread.sleep(2000);
        driver.findElement(By.xpath("//button[text()='Apply']")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//div[@aria-labelledby='demo-simple-select-label demo-simple-select']")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//div[text()='" + leaveType + "']")).click();
        driver.findElement(By.xpath("(//button[text()='Apply'])[2]")).click();
    }

    private void deleteLeaveRequest(String reason) throws InterruptedException {
        Thread.sleep(3000);
        driver.findElement(By.xpath("//span[text()='Casual leave']/..")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//button[text()='Delete']")).click();
        Thread.sleep(2000);
        driver.findElement(By.name("deleteReason")).sendKeys(reason);
        driver.findElement(By.xpath("//button[text()='Delete']")).click();
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
