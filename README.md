# TFC Self Service Demo

```
{
  environment = "dev",
  name = "neil-test",
  owner = "neil-dahlke"
}
```


```
terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "hc-se-tfe-demo-neil"

    workspaces {
      name = "self-service-config-designer"
    }
  }
}
```