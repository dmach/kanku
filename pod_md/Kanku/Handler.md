# NAME 

Kanku::Handler - Documentation about Kanku::Handler::\* modules

# DESCRIPTION

Kanku handler modules are used to run a specific task. 
They have to provide the following three methods:

- prepare
- execute
- finalize

which are executed in this order. 

# MODULES

- [Kanku::Handler::Reboot](./Kanku%3A%3AHandler%3A%3AReboot)
- [Kanku::Handler::CreateDomain](./Kanku%3A%3AHandler%3A%3ACreateDomain)
- [Kanku::Handler::ExecuteCommandViaSSH](./Kanku%3A%3AHandler%3A%3AExecuteCommandViaSSH)
- [Kanku::Handler::GIT](./Kanku%3A%3AHandler%3A%3AGIT)
- [Kanku::Handler::HTTPDownload](./Kanku%3A%3AHandler%3A%3AHTTPDownload)
- [Kanku::Handler::OBSCheck](./Kanku%3A%3AHandler%3A%3AOBSCheck)
- [Kanku::Handler::OpenStack::CreateInstance](./Kanku%3A%3AHandler%3A%3AOpenStack%3A%3ACreateInstance)
- [Kanku::Handler::OpenStack::Image](./Kanku%3A%3AHandler%3A%3AOpenStack%3A%3AImage)
- [Kanku::Handler::OpenStack::RemoveInstance](./Kanku%3A%3AHandler%3A%3AOpenStack%3A%3ARemoveInstance)
- [Kanku::Handler::PortForward](./Kanku%3A%3AHandler%3A%3APortForward)
- [Kanku::Handler::PrepareSSH](./Kanku%3A%3AHandler%3A%3APrepareSSH)
- [Kanku::Handler::RemoveDomain](./Kanku%3A%3AHandler%3A%3ARemoveDomain)
- [Kanku::Handler::RevertQcow2Snapshot](./Kanku%3A%3AHandler%3A%3ARevertQcow2Snapshot)
- [Kanku::Handler::SaltSSH](./Kanku%3A%3AHandler%3A%3ASaltSSH)
- [Kanku::Handler::SetJobContext](./Kanku%3A%3AHandler%3A%3ASetJobContext)
- [Kanku::Handler::Wait](./Kanku%3A%3AHandler%3A%3AWait)
- [Kanku::Handler::ImageDownload](./Kanku%3A%3AHandler%3A%3AImageDownload)
- Kanku::Handler::FileCopy               - DEPRECATED
- Kanku::Handler::FileMove               - DEPRECATED
- Kanku::Handler::OBSDownload	     - DEPRECATED
