package zerogod.ecetaskhelper;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class EcEtaskHelperApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcEtaskHelperApplication.class, args);
    }

}
