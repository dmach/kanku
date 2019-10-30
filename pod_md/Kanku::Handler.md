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

- [Kanku::Handler::Reboot](./Kanku%3A%3AHandler%3A%3AReboot.md)
- [Kanku::Handler::CreateDomain](./Kanku%3A%3AHandler%3A%3ACreateDomain.md)
- [Kanku::Handler::ExecuteCommandViaSSH](./Kanku%3A%3AHandler%3A%3AExecuteCommandViaSSH.md)
- [Kanku::Handler::GIT](./Kanku%3A%3AHandler%3A%3AGIT.md)
- [Kanku::Handler::HTTPDownload](./Kanku%3A%3AHandler%3A%3AHTTPDownload.md)
- [Kanku::Handler::OBSCheck](./Kanku%3A%3AHandler%3A%3AOBSCheck.md)
- [Kanku::Handler::OpenStack::CreateInstance](./Kanku%3A%3AHandler%3A%3AOpenStack%3A%3ACreateInstance.md)
- [Kanku::Handler::OpenStack::Image](./Kanku%3A%3AHandler%3A%3AOpenStack%3A%3AImage.md)
- [Kanku::Handler::OpenStack::RemoveInstance](./Kanku%3A%3AHandler%3A%3AOpenStack%3A%3ARemoveInstance.md)
- [Kanku::Handler::PortForward](./Kanku%3A%3AHandler%3A%3APortForward.md)
- [Kanku::Handler::PrepareSSH](./Kanku%3A%3AHandler%3A%3APrepareSSH.md)
- [Kanku::Handler::RemoveDomain](./Kanku%3A%3AHandler%3A%3ARemoveDomain.md)
- [Kanku::Handler::RevertQcow2Snapshot](./Kanku%3A%3AHandler%3A%3ARevertQcow2Snapshot.md)
- [Kanku::Handler::SaltSSH](./Kanku%3A%3AHandler%3A%3ASaltSSH.md)
- [Kanku::Handler::SetJobContext](./Kanku%3A%3AHandler%3A%3ASetJobContext.md)
- [Kanku::Handler::Wait](./Kanku%3A%3AHandler%3A%3AWait.md)
- [Kanku::Handler::ImageDownload](./Kanku%3A%3AHandler%3A%3AImageDownload.md)
- Kanku::Handler::FileCopy               - DEPRECATED
- Kanku::Handler::FileMove               - DEPRECATED
- Kanku::Handler::OBSDownload	     - DEPRECATED
