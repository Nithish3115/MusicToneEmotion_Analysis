# """
# Author: Jeffrey Luo, Monta Vista High School, Cupertino, CA
# Date Created: 09/2023
# Copyright (c) 2023 Jeff Luo
# License: MIT
# """
# import torch
# import tensorboard
# import os
# from tqdm import tqdm
# import torch.nn as nn
# import torch.optim as optim
# from torch.utils.tensorboard import SummaryWriter

# from model_torch import Audio2EmotionModel
# from datasets import build_default_dataloader

# import torch
# torch.cuda.device_count()  # This will throw an error if CUDA is not available
# torch.device("cpu")
# def train():
#     """
#     Train loop
#     """
#     # get all data names
#     data_list = os.listdir('data/spectrograms')
#     data_list = [ f.split('.')[0] for f in data_list]

#     # prepare train/val data
#     train_valid_split = 0.8
#     cut_off = int(len(data_list)*train_valid_split)
#     train_list = data_list[:cut_off]
#     val_list = data_list[cut_off:]

#     print(f'Training Set:{len(train_list)}, Validation Set:{len(val_list)}')

#     # init train/val dataloader
#     train_loader = build_default_dataloader(train_list)
#     val_loader = build_default_dataloader(val_list)

#     # init model
#     model = Audio2EmotionModel()
#     model.to('cuda')

#     # loss
#     criterion = nn.CrossEntropyLoss()

#     # set up optimizer
#     learning_rate = 0.0005
#     optimizer = optim.Adam(model.parameters(), lr=learning_rate)

#     # Training setting
#     num_epochs = 1000

#     early_stop_patience = 50
#     early_stop_delta = 1e-3
#     early_stop_counter = 0

#     model_save_path = 'weights/'
#     best_loss = float('inf')

#     # tensorboard support
#     writer = SummaryWriter('train_log/')

#     # train loop
#     for epoch in range(num_epochs):
        
#         # set to train mode
#         model.train()
#         data_loop = tqdm(enumerate(train_loader), total=len(train_loader), leave=False)
#         data_loop.set_description(f'Epoch [{epoch}/{num_epochs}]')
#         for idx, (data, target) in data_loop:
#             data = data.to('cuda')
#             target = target.to('cuda')

#             # loss compute
#             pred = model(data)
#             loss = criterion(pred, target)

#             # backpropagation
#             loss.backward()
#             optimizer.step()
#             optimizer.zero_grad()

#             data_loop.set_postfix(loss=loss.item())
            
#             writer.add_scalar('Train Loss', loss.item(), idx+len(data_loop)*epoch)

#         # validation loop
#         val_loop = tqdm(val_loader, total=len(val_loader))
#         val_loop.set_description(f'Validation [{epoch}/{num_epochs}]')
#         val_losses = 0
#         model.eval()
#         with torch.no_grad():
#             for data, target in val_loop:
#                 data, target = data.to('cuda'), target.to('cuda')
#                 pred = model(data)
#                 val_losses += criterion(pred, target).item()
                
#         val_losses /= len(val_loader)
#         writer.add_scalar('Val Loss', val_losses, epoch)

#         # save at the end of epoch
#         torch.save(model.state_dict(), os.path.join(model_save_path, 'last.pth'))
            
#         # early stop checking and saving
#         if best_loss - val_losses > early_stop_delta:
#             # reset counter if loss improves
#             early_stop_counter = 0
#             best_loss = val_losses
#             # save the best check early stop condition
#             torch.save(model.state_dict(), os.path.join(model_save_path, f'best.pth'))
#         else:
#             # if loss no improvement (best_loss - val_losses <= early_stop_delta)
#             early_stop_counter+=1
#             if early_stop_counter > early_stop_patience:
#                 print(f'Early stop@epoch{epoch}')
#                 break


# if __name__ == '__main__':
#     train()


import torch
import tensorboard
import os
from tqdm import tqdm
import torch.nn as nn
import torch.optim as optim
from torch.utils.tensorboard import SummaryWriter

from model_torch import Audio2EmotionModel
from datasets import build_default_dataloader

def train():
    """
    Train loop
    """
    # get all data names
    data_list = os.listdir('data/spectrograms')
    data_list = [f.split('.')[0] for f in data_list]

    # prepare train/val data
    train_valid_split = 0.8
    cut_off = int(len(data_list)*train_valid_split)
    train_list = data_list[:cut_off]
    val_list = data_list[cut_off:]

    print(f'Training Set:{len(train_list)}, Validation Set:{len(val_list)}')

    # init train/val dataloader
    train_loader = build_default_dataloader(train_list)
    val_loader = build_default_dataloader(val_list)

    # init model
    model = Audio2EmotionModel()
    model.to('cpu')  # Move model to CPU

    # loss
    criterion = nn.CrossEntropyLoss()

    # set up optimizer
    learning_rate = 0.0005
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    # Training setting
    num_epochs = 5

    early_stop_patience = 50
    early_stop_delta = 1e-3
    early_stop_counter = 0

    model_save_path = 'weights/'
    best_loss = float('inf')

    # tensorboard support
    writer = SummaryWriter('train_log/')

    # train loop
    for epoch in range(num_epochs):
        
        # set to train mode
        model.train()
        data_loop = tqdm(enumerate(train_loader), total=len(train_loader), leave=False)
        data_loop.set_description(f'Epoch [{epoch}/{num_epochs}]')
        for idx, (data, target) in data_loop:
            data = data.to('cpu')  # Move data to CPU
            target = target.to('cpu')  # Move target to CPU

            # loss compute
            pred = model(data)
            loss = criterion(pred, target)

            # backpropagation
            loss.backward()
            optimizer.step()
            optimizer.zero_grad()

            data_loop.set_postfix(loss=loss.item())
            
            writer.add_scalar('Train Loss', loss.item(), idx+len(data_loop)*epoch)

        # validation loop
        val_loop = tqdm(val_loader, total=len(val_loader))
        val_loop.set_description(f'Validation [{epoch}/{num_epochs}]')
        val_losses = 0
        model.eval()
        with torch.no_grad():
            for data, target in val_loop:
                data, target = data.to('cpu'), target.to('cpu')  # Move data and target to CPU
                pred = model(data)
                val_losses += criterion(pred, target).item()
                
        val_losses /= len(val_loader)
        writer.add_scalar('Val Loss', val_losses, epoch)

        # save at the end of epoch
        torch.save(model.state_dict(), os.path.join(model_save_path, 'last.pth'))
            
        # early stop checking and saving
        if best_loss - val_losses > early_stop_delta:
            # reset counter if loss improves
            early_stop_counter = 0
            best_loss = val_losses
            # save the best check early stop condition
            torch.save(model.state_dict(), os.path.join(model_save_path, f'best.pth'))
        else:
            # if loss no improvement (best_loss - val_losses <= early_stop_delta)
            early_stop_counter+=1
            if early_stop_counter > early_stop_patience:
                print(f'Early stop@epoch{epoch}')
                break


if __name__ == '__main__':
    train()