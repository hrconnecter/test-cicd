package basic;
 
import java.io.File;
import java.time.Duration;
 
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
 
import essential.BaseDriverSetup;
 
public class Form16 {
 
	private WebDriver driver;
 
    @BeforeClass
    public void setup() {
        driver = BaseDriverSetup.getDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(25));
        driver.get("https://app.aegishrms.com/sign-in");
        System.out.println("=========================================================");
        System.out.println("▶️ FORM 16 DOWNLOAD");
    }
    
    @Test
    public void expenseworkflow() {
        try {
            login("automationscripts@gmail.com", "Pass@123");
            formUpload();
            logout();
            System.out.println("Super admin logout");
 
            System.out.println("=========================================================");
            System.out.println("✅ FORM 16 DOWNLOAD- PASSED");
            
        } catch (Exception e) {
        	System.out.println("❌ FORM 16 DOWNLOAD- FAILED");
            System.out.println("🔍 Error Message: " + e.getMessage());
            e.printStackTrace();
            Assert.fail("Test failed due to exception: " + e.getMessage());

        }
    }
    
    public void formUpload() throws InterruptedException {
 
    	System.out.println("Super admin login");
        Thread.sleep(2000);
        driver.findElement(By.linkText("Go To Organisation")).click();
        driver.findElement(By.xpath("(//button[text()='Setup'])[2]")).click();
        driver.findElement(By.xpath("//button[@aria-label='open drawer']")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//h1[text()='Payroll']")).click();
        driver.findElement(By.linkText("Form-16")).click();
        
        driver.findElement(By.xpath("//input[@placeholder='Search Employee Name....']")).sendKeys("tds" + Keys.ENTER);
        driver.findElement(By.xpath("//*[local-name()='svg' and @data-testid='MoreVertIcon']")).click();
        
        //Upload Form-16 
        driver.findElement(By.xpath("//li[@aria-label='Button for uploading form 16']")).click();
        String filePath= new File("src/test/resources/form_16_part_a_sample.pdf").getAbsolutePath();
        WebElement choosefile= driver.findElement(By.xpath("//input[@type='file']"));
        choosefile.sendKeys(filePath);
        Thread.sleep(2000);
        driver.findElement(By.xpath("//button[text()='Upload Form 16']")).click();
        Thread.sleep(2000);
        System.out.println("Form-16 uploaded successfully for TDS employee");
        
//        //Download and View Form-16
//        driver.findElement(By.xpath("//li[@aria-label='Button for downloading or view  form 16']")).click();
//        driver.findElement(By.xpath("//button[text()='Download Form 16']")).click();
//        Thread.sleep(5000);
//        
        //Delete Form-16 
        driver.findElement(By.xpath("//li[@aria-label='Button for deleting  form 16']")).click();
        driver.findElement(By.xpath("//button[text()='Delete Form 16']")).click();  
        driver.findElement(By.xpath("//button[text()='Delete']")).click();
        Thread.sleep(3000);
        System.out.println("Form-16 deleted successfully for TDS employee");
        
    }
    
    private void login(String email, String password) throws InterruptedException {
        Thread.sleep(2000);
        driver.findElement(By.id("email")).sendKeys(email);
        driver.findElement(By.id("password")).sendKeys(password);
        driver.findElement(By.xpath("//button[text()='Login']")).click();
    }
 
    private void logout() throws InterruptedException {
        Thread.sleep(2000);
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
 